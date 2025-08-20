import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Info, BarChart } from "lucide-react";

const FeaturesPage = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
            {/* Hero / Intro */}
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">YouTube Comment Analysis App</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Analyze comments from any YouTube video and gain actionable insights into what users like, dislike, or feel neutral about. This tool helps creators improve their content and understand their audience better, leveraging the power of OpenAI's AI models.
                </p>
            </div>

            <Separator />

            {/* How It Works */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" /> Fetch Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Provide a YouTube video link, and the app fetches available comments via the official YouTube API. Only valid comments are analyzed, some may be excluded due to spam detection or API limitations.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" /> Sentiment Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Comments are automatically categorized into positive, negative, or neutral. Quickly view sentiment distribution and understand audience reactions at a glance.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" /> Summary Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Gain summarized insights about what users liked or disliked most. Creators can enhance positive aspects and address negative feedback effectively.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-purple-500" /> Scalable Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Currently, up to 100 comments per video are analyzed. For videos with thousands of comments, the most relevant ones are selected according to YouTube's algorithm. Future versions will allow analyzing unlimited comments for deeper insights.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Why Use This App</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Understand Your Audience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Quickly identify user sentiments and preferences without manually reading every comment.</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Improve Content Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Focus on enhancing well-received aspects of videos while addressing critical feedback efficiently.</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Actionable AI Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Leverages OpenAI’s AI models to generate concise, meaningful insights from large volumes of comments.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator />

            {/* Example Scenarios */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Example Scenarios</h2>
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Scenario 1: Video with 30 Comments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>
                                A video has 30 comments. The app fetches these comments and performs sentiment analysis:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>15 comments are positive → highlighted in green.</li>
                                <li>10 comments are negative → highlighted in red.</li>
                                <li>5 comments are neutral → highlighted in yellow.</li>
                            </ul>
                            <p>
                                A summarized insight shows which topics are most appreciated or criticized, helping creators plan future content.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Scenario 2: Video with 1,000+ Comments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>
                                A video has over 1,000 comments. The app analyzes up to 100 relevant comments initially:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Positive, negative, and neutral sentiments are identified from a representative sample.</li>
                                <li>Creators can see what aspects of their content are most engaging or need improvement.</li>
                                <li>Future updates will allow batch analysis of thousands of comments, offering full-scale insights for large videos.</li>
                            </ul>
                            <p>
                                This approach ensures actionable insights even for highly popular videos while maintaining fast and reliable performance.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Why Use This App</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Understand Your Audience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Quickly identify user sentiments and preferences without manually reading every comment.</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Improve Content Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Focus on enhancing well-received aspects of videos while addressing critical feedback efficiently.</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Actionable AI Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Leverages OpenAI’s AI models to generate concise, meaningful insights from large volumes of comments.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;
