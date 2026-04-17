import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Eye, Users, MousePointerClick, Heart, MessageCircle, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface PageView {
  path: string;
  referrer: string | null;
  session_id: string | null;
  event_type: string;
  created_at: string;
}

interface ArticleEngagement {
  article_slug: string;
  likes: number;
  comments: number;
  total: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [articleEngagement, setArticleEngagement] = useState<ArticleEngagement[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Auth check + role check
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast({ title: "Access denied", description: "Admin only.", variant: "destructive" });
        navigate("/", { replace: true });
        return;
      }
      setIsAdmin(true);
      await loadData();
      setLoading(false);
    };

    checkAccess();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth", { replace: true });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const loadData = async () => {
    const since = subDays(new Date(), 30).toISOString();
    const [pvRes, likesRes, commentsRes] = await Promise.all([
      supabase.from("page_views").select("*").gte("created_at", since).order("created_at", { ascending: false }),
      supabase.from("article_likes").select("article_slug"),
      supabase.from("article_comments").select("article_slug"),
    ]);

    if (pvRes.data) setPageViews(pvRes.data as PageView[]);

    // Engagement aggregation
    const map: Record<string, { likes: number; comments: number }> = {};
    (likesRes.data || []).forEach((l) => {
      map[l.article_slug] = map[l.article_slug] || { likes: 0, comments: 0 };
      map[l.article_slug].likes++;
    });
    (commentsRes.data || []).forEach((c) => {
      map[c.article_slug] = map[c.article_slug] || { likes: 0, comments: 0 };
      map[c.article_slug].comments++;
    });
    setArticleEngagement(
      Object.entries(map)
        .map(([article_slug, v]) => ({ article_slug, ...v, total: v.likes + v.comments }))
        .sort((a, b) => b.total - a.total)
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-medium-articles");
      if (error) throw error;
      toast({
        title: "Articles synced",
        description: `${data.articles_synced} articles refreshed from Medium.`,
      });
    } catch (err) {
      toast({
        title: "Sync failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  // Aggregations
  const totalViews = pageViews.filter((p) => p.event_type === "pageview").length;
  const uniqueSessions = new Set(pageViews.map((p) => p.session_id).filter(Boolean)).size;

  const viewsToday = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    return pageViews.filter((p) => p.event_type === "pageview" && new Date(p.created_at).getTime() >= today).length;
  }, [pageViews]);

  const viewsThisWeek = useMemo(() => {
    const weekAgo = subDays(new Date(), 7).getTime();
    return pageViews.filter((p) => p.event_type === "pageview" && new Date(p.created_at).getTime() >= weekAgo).length;
  }, [pageViews]);

  // Daily timeseries (last 14 days)
  const dailyData = useMemo(() => {
    const days: { date: string; views: number; visitors: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const next = startOfDay(subDays(new Date(), i - 1));
      const dayViews = pageViews.filter((p) => {
        const t = new Date(p.created_at).getTime();
        return p.event_type === "pageview" && t >= day.getTime() && t < next.getTime();
      });
      days.push({
        date: format(day, "MMM d"),
        views: dayViews.length,
        visitors: new Set(dayViews.map((p) => p.session_id).filter(Boolean)).size,
      });
    }
    return days;
  }, [pageViews]);

  // Top pages
  const topPages = useMemo(() => {
    const map: Record<string, number> = {};
    pageViews.filter((p) => p.event_type === "pageview").forEach((p) => {
      map[p.path] = (map[p.path] || 0) + 1;
    });
    return Object.entries(map)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [pageViews]);

  // Top referrers
  const topReferrers = useMemo(() => {
    const map: Record<string, number> = {};
    pageViews.forEach((p) => {
      const ref = p.referrer ? new URL(p.referrer).hostname : "(direct)";
      map[ref] = (map[ref] || 0) + 1;
    });
    return Object.entries(map)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [pageViews]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Last 30 days of activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              Sync Medium
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              View site
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Eye className="h-4 w-4" />} label="Total Views (30d)" value={totalViews} />
          <StatCard icon={<Users className="h-4 w-4" />} label="Unique Visitors" value={uniqueSessions} />
          <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Views Today" value={viewsToday} />
          <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Views This Week" value={viewsThisWeek} />
        </div>

        {/* Daily chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Traffic (Last 14 days)</CardTitle>
            <CardDescription>Pageviews and unique visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--secondary))" strokeWidth={2} name="Views" />
                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} name="Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most-visited paths</CardDescription>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <div className="space-y-2">
                  {topPages.map((p) => (
                    <div key={p.path} className="flex items-center justify-between gap-4 text-sm py-1.5 border-b border-border last:border-0">
                      <span className="truncate font-mono text-xs">{p.path}</span>
                      <span className="font-medium tabular-nums">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top referrers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Where visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {topReferrers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <div className="space-y-2">
                  {topReferrers.map((r) => (
                    <div key={r.source} className="flex items-center justify-between gap-4 text-sm py-1.5 border-b border-border last:border-0">
                      <span className="truncate">{r.source}</span>
                      <span className="font-medium tabular-nums">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Most engaged articles */}
        <Card>
          <CardHeader>
            <CardTitle>Most Engaged Articles</CardTitle>
            <CardDescription>Likes + comments across all Litu Musings posts</CardDescription>
          </CardHeader>
          <CardContent>
            {articleEngagement.length === 0 ? (
              <p className="text-sm text-muted-foreground">No engagement yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={Math.max(200, articleEngagement.length * 40)}>
                  <BarChart data={articleEngagement} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="article_slug" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="likes" stackId="a" fill="hsl(var(--secondary))" name="Likes" />
                    <Bar dataKey="comments" stackId="a" fill="hsl(var(--primary))" name="Comments" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {articleEngagement.map((a) => (
                    <div key={a.article_slug} className="flex items-center justify-between gap-4 text-sm py-1.5 border-b border-border last:border-0">
                      <span className="truncate font-mono text-xs">{a.article_slug}</span>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {a.likes}</span>
                        <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {a.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
        {icon} {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</div>
    </CardContent>
  </Card>
);

export default Admin;
