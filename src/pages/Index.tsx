import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePollDialog } from "@/components/CreatePollDialog";
import { PollCard } from "@/components/PollCard";
import { Loader2 } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  likes_count: number;
  created_at: string;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes_count: number;
}

const Index = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollOptions, setPollOptions] = useState<Record<string, PollOption[]>>({});
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem("quickpoll_session_id");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("quickpoll_session_id", newId);
    return newId;
  });

  useEffect(() => {
    fetchPolls();
    subscribeToPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    
    const { data: pollsData, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Error fetching polls:", pollsError);
      setLoading(false);
      return;
    }

    const { data: optionsData, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .order("created_at");

    if (optionsError) {
      console.error("Error fetching options:", optionsError);
      setLoading(false);
      return;
    }

    setPolls(pollsData || []);

    const optionsByPoll: Record<string, PollOption[]> = {};
    optionsData?.forEach((option) => {
      if (!optionsByPoll[option.poll_id]) {
        optionsByPoll[option.poll_id] = [];
      }
      optionsByPoll[option.poll_id].push(option);
    });

    setPollOptions(optionsByPoll);
    setLoading(false);
  };

  const subscribeToPolls = () => {
    const channel = supabase
      .channel("polls-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "polls",
        },
        () => {
          fetchPolls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12 text-center animate-slide-up">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            QuickPoll
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create polls, vote, and see results update in real-time
          </p>
          <CreatePollDialog onPollCreated={fetchPolls} />
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="inline-block p-8 rounded-2xl gradient-card border border-border card-shadow">
              <h3 className="text-2xl font-semibold mb-2">No polls yet</h3>
              <p className="text-muted-foreground">
                Be the first to create a poll!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                options={pollOptions[poll.id] || []}
                sessionId={sessionId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
