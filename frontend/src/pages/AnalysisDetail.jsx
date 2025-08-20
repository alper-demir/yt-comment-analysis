import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOneAnalyze } from "@/services/analizeService";
import AnalizeResult from "@/components/AnalizeResult";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const AnalysisDetail = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await getOneAnalyze(id);
                if (!res.ok) {
                    const errorData = await res.json();
                    toast.error(errorData.message || "Failed to fetch analysis");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log(data)
                setAnalysis(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    if (loading) return <LoadingSpinner />;

    if (!analysis) {
        return <p className="text-center text-muted-foreground">No analysis found.</p>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Analysis Detail</h1>
            <AnalizeResult
                analysis={analysis}
            />
        </div>
    );
};

export default AnalysisDetail;