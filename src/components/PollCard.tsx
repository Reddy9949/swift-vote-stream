import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  option_text: string;
  votes_count: number;
}

interface Poll {
  id: string;
  title: string;
  likes_count: number;
  created_at: string;
}

interface PollCardProps {
  poll: Poll;
  options: PollOption[];
  sessionId: string;
}

export const PollCard = ({ poll, options, sessionId }: PollCardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState(options);
  const [likesCount, setLikesCount] = useState(poll.likes_count);

  const totalVotes = currentOptions.reduce((sum, opt) => sum + opt.votes_count, 0);

  useEffect(() => {
    checkVoteStatus();
    checkLikeStatus();
    subscribeToUpdates();
  }, [poll.id]);

  const checkVoteStatus = async () => {
    const { data } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", poll.id)
      .eq("session_id", sessionId)
      .single();

    if (data) {
      setHasVoted(true);
      setSelectedOption(data.option_id);
    }
  };

  const checkLikeStatus = async () => {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("poll_id", poll.id)
      .eq("session_id", sessionId)
      .single();

    setHasLiked(!!data);
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`poll-${poll.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "poll_options",
          filter: `poll_id=eq.${poll.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("poll_options")
            .select("*")
            .eq("poll_id", poll.id)
            .order("created_at");

          if (data) {
            setCurrentOptions(data);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "polls",
          filter: `id=eq.${poll.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("polls")
            .select("likes_count")
            .eq("id", poll.id)
            .single();

          if (data) {
            setLikesCount(data.likes_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted) return;

    try {
      const { error } = await supabase.from("votes").insert({
        poll_id: poll.id,
        option_id: optionId,
        session_id: sessionId,
      });

      if (error) throw error;

      setHasVoted(true);
      setSelectedOption(optionId);
      toast.success("Vote recorded!");
    } catch (error: any) {
      console.error("Error voting:", error);
      if (error.code === "23505") {
        toast.error("You've already voted on this poll");
      } else {
        toast.error("Failed to vote");
      }
    }
  };

  const handleLike = async () => {
    try {
      if (hasLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("poll_id", poll.id)
          .eq("session_id", sessionId);

        if (error) throw error;
        setHasLiked(false);
      } else {
        const { error } = await supabase.from("likes").insert({
          poll_id: poll.id,
          session_id: sessionId,
        });

        if (error) throw error;
        setHasLiked(true);
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className="gradient-card border-border card-shadow animate-slide-up overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{poll.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "transition-all",
              hasLiked && "text-accent"
            )}
          >
            <Heart className={cn("h-5 w-5", hasLiked && "fill-current")} />
            <span className="ml-1.5">{likesCount}</span>
          </Button>
        </div>

        <div className="space-y-3">
          {currentOptions.map((option) => {
            const percentage = getPercentage(option.votes_count);
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden",
                  hasVoted
                    ? "cursor-default"
                    : "cursor-pointer hover:border-primary",
                  isSelected && "border-primary"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-500",
                    isSelected ? "bg-primary/20" : "bg-muted/20"
                  )}
                  style={{ width: hasVoted ? `${percentage}%` : "0%" }}
                />
                <div className="relative flex justify-between items-center">
                  <span className="font-medium">{option.option_text}</span>
                  {hasVoted && (
                    <span className="text-sm font-semibold">
                      {percentage}% ({option.votes_count})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {hasVoted && (
          <div className="text-sm text-muted-foreground text-center pt-2">
            {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
          </div>
        )}
      </div>
    </Card>
  );
};
