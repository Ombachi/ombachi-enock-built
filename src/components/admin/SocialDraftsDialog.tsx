import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Copy, RefreshCw } from "lucide-react";

interface Props {
  post: { id: string; title: string } | null;
  onClose: () => void;
}

const SocialDraftsDialog = ({ post, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");
  const [url, setUrl] = useState("");

  const generate = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("social-drafts", { body: { postId: id } });
    setLoading(false);
    if (error || data?.error) {
      toast({ title: "Drafting failed", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    setLinkedin(data.linkedin);
    setX(data.x);
    setUrl(data.url);
  };

  useEffect(() => {
    if (post) {
      setLinkedin("");
      setX("");
      generate(post.id);
    }
  }, [post?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async (t: string) => {
    await navigator.clipboard.writeText(t);
    toast({ title: "Copied" });
  };

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Social drafts</DialogTitle>
          <DialogDescription>{post?.title}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="li-draft">LinkedIn</Label>
              <Textarea id="li-draft" rows={8} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(linkedin)}><Copy className="h-4 w-4 mr-1" />Copy</Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Open LinkedIn</a>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="x-draft">X ({x.length}/280)</Label>
              <Textarea id="x-draft" rows={4} value={x} onChange={(e) => setX(e.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(x)}><Copy className="h-4 w-4 mr-1" />Copy</Button>
                <Button size="sm" asChild>
                  <a href={`https://x.com/intent/post?text=${encodeURIComponent(x)}`} target="_blank" rel="noopener noreferrer">Post on X</a>
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => post && generate(post.id)}>
              <RefreshCw className="h-4 w-4 mr-1" />Regenerate
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocialDraftsDialog;
