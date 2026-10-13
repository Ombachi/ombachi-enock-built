import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session || window.location.hash.includes("type=recovery")) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated" });
    const { data } = await supabase.auth.getUser();
    const { data: role } = data.user
      ? await supabase.from("user_roles").select("id").eq("user_id", data.user.id).eq("role", "admin").maybeSingle()
      : { data: null };
    navigate(role ? "/admin" : "/account", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Set a new password — Ombachi Enock</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Set a new password</CardTitle>
          <CardDescription>
            {ready ? "Choose a new password for your account." : "Open this page from the recovery link in your email."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ready ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" required minLength={8} autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input id="confirm-password" type="password" required minLength={8} autoComplete="new-password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save new password
              </Button>
            </form>
          ) : (
            <Link to="/auth" className="text-sm text-secondary hover:underline">Request a new recovery link</Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
