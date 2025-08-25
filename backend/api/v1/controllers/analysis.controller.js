import OpenAI from "openai";
import Analize from "../models/analize.model.js";
import User from "../models/user.model.js";
import { encoding_for_model } from "tiktoken";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getComments = async (req, res) => {
    const { id } = req.params;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&maxResults=100&key=${YOUTUBE_API_KEY}`, {
        method: "GET"
    });

    const data = await response.json();
    console.log(data);

    if (data.error) {
        console.log(data);
        return res.status(data.error.code).json({ error: data.error.message });
    }
    if (data.items.length === 0) return res.status(400).json({ message: "No comments found", status: false });

    const comments = data.items.map((item) => item.snippet.topLevelComment.snippet.textDisplay);
    console.log("Filtrelenmiş Yorumlar:" + comments);

    const mockComments = []

    const resp = await fetch(`${BACKEND_URL}/analyze-comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": req.headers.authorization
        },
        //body: JSON.stringify({ comments, videoId: id }),
        body: JSON.stringify({ comments: mockComments, videoId: id })
    })

    const anaylzedData = await resp.json();
    res.status(200).json(anaylzedData);
}

export const analizeComments = async (req, res) => {
    const clientIp = req.clientIp;
    const userId = req.user.id;
    const { videoId } = req.body;
    console.log(clientIp);

    try {
        const { comments } = req.body;
        if (!comments || !Array.isArray(comments)) {
            return res.status(400).json({ error: "comments bir dizi olmalı" });
        }

        const user = await User.findByPk(userId, { attributes: ['tokens', 'id'] });
        if (!user) return res.status(404).json({ error: "User not found" });

        // GPT promt
        const prompt = `
                        You are a helpful assistant for sentiment analysis and summarization.
                        Analyze the following user comments about a YouTube video. 
                        Return a JSON object with counts of positive, negative, and neutral comments, 
                        and write natural language summaries for what users liked and disliked.

                        Comments:
                        ${comments.map((c, i) => `${i + 1}. ${c}`).join("\n")}

                        Respond in JSON format like this:
                        {
                        "positive": <number>,
                        "negative": <number>,
                        "neutral": <number>,
                        "liked_summary": "<natural language summary of what users liked>",
                        "disliked_summary": "<natural language summary of what users disliked>"
                        }
                        `;


        // const enc = encoding_for_model("gpt-3.5-turbo");
        // const estimatedInputTokens = enc.encode(prompt).length;
        // enc.free();
        // console.log("Estimated input tokens:", estimatedInputTokens);

        // const outputBuffer = 300; // Secure estimated token output
        // const totalEstimate = estimatedInputTokens + outputBuffer;

        // if (user.tokens < totalEstimate) {
        //     return res.status(400).json({ message: "Not enough tokens to analyze the content" });
        // }

        // const completion = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     messages: [{ role: "user", content: prompt }],
        //     // max_tokens: 300,
        //     //  temperature: 0.7,
        // });

        // GPT cevabı al
        // const responseText = completion.choices[0].message.content;

        const mockResponse = {
            "positive": 5,
            "negative": 1,
            "neutral": 1,
            "liked_summary": "Users liked the official release of the soundtrack, the nostalgic feelings it brought, and the quality of the episode.",
            "disliked_summary": "One user expressed sadness over a character death in Star Wars, which was the only negative comment.",
            "inputTokens": "564",
            "outputTokens": "134",
            "totalTokens": "698",
            "commentsCount": "7"
        }


        // JSON parse, GPT gives text format in response
        // let jsonResponse;
        // try {
        //     jsonResponse = JSON.parse(responseText);
        // } catch {
        //     return res.status(500).json({ error: "GPT response is not in JSON format", raw: responseText });
        // }

        // const tokenUsage = completion.usage;
        // const totalTokens = tokenUsage.total_tokens;
        // const inputTokens = tokenUsage.prompt_tokens;
        // const outputTokens = tokenUsage.completion_tokens;

        // jsonResponse.inputTokens = inputTokens;
        // jsonResponse.outputTokens = outputTokens;
        // jsonResponse.totalTokens = totalTokens;
        // jsonResponse.commentsCount = comments.length;

        // console.log("Toplam Token Kullanımı:", tokenUsage);
        // console.log("Toplam Token Sayısı:", totalTokens);
        // console.log("Giriş Token Sayısı:", inputTokens);
        // console.log("Çıkış Token Sayısı:", outputTokens);

        // // Reduce user tokens
        // if (totalTokens <= user.tokens) {
        //     user.tokens -= totalTokens;
        // } else {
        //     // If actual usage > user balance, set it to 0
        //     const subsidized = Math.abs(user.tokens - totalTokens); // The amount of tokens covered by the system
        //     console.log("Subsidized tokens by the application: " + subsidized);
        //     user.tokens = 0;
        // }

        // await user.save();

        // Create analysis record
        // await Analize.create({
        //     ip: clientIp,
        //     userId: userId ? userId : null,
        //     positive_comment_count: jsonResponse.positive,
        //     negative_comment_count: jsonResponse.negative,
        //     neutral_comment_count: jsonResponse.neutral,
        //     total_comment_count: comments.length,
        //     positive_comment_summary: jsonResponse.liked_summary,
        //     negative_comment_summary: jsonResponse.disliked_summary,
        //     input_token: inputTokens,
        //     output_token: outputTokens,
        //     total_token: totalTokens,
        //     videoId
        // })

        await Analize.create({
            ip: clientIp,
            userId: userId ? userId : null,
            positive_comment_count: mockResponse.positive,
            negative_comment_count: mockResponse.negative,
            neutral_comment_count: mockResponse.neutral,
            total_comment_count: comments.length,
            positive_comment_summary: mockResponse.liked_summary,
            negative_comment_summary: mockResponse.disliked_summary,
            input_token: inputTokens,
            output_token: outputTokens,
            total_token: totalTokens,
            videoId
        })

        //return res.status(200).json(jsonResponse);
        res.status(200).json(mockResponse);
    } catch (error) {
        console.error("API hatası:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const getAnalizes = async (req, res) => {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {

        const analizes = await Analize.findAndCountAll({
            where: { userId },
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        res.json(analizes);

    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}

export const getAnalize = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const analize = await Analize.findByPk(id);

        if (!analize) return res.status(404).json({ message: "Analize record not found", status: false });
        if (analize.userId !== userId) return res.status(403).json({ message: "You are not authorized to access this record", status: false })

        const normalized = {
            id: analize.id,
            videoId: analize.videoId,
            positive: analize.positive_comment_count,
            negative: analize.negative_comment_count,
            neutral: analize.neutral_comment_count,
            totalComments: analize.total_comment_count,
            liked_summary: analize.positive_comment_summary,
            disliked_summary: analize.negative_comment_summary,
            createdAt: analize.createdAt,
        };
        res.json(normalized);

    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}

export const getDashboardSummary = async (req, res) => {
    const userId = req.user.id;

    try {
        const [totalAnalyses, totalComments, totalTokens, positive, negative, neutral] = await Promise.all([
            Analize.count({ where: { userId } }),
            Analize.sum("total_comment_count", { where: { userId } }),
            Analize.sum("total_token", { where: { userId } }),
            Analize.sum("positive_comment_count", { where: { userId } }),
            Analize.sum("negative_comment_count", { where: { userId } }),
            Analize.sum("neutral_comment_count", { where: { userId } }),
        ]);

        // Son 5 analiz
        const lastAnalyzes = await Analize.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit: 5,
            attributes: [
                "id",
                "videoId",
                "positive_comment_count",
                "negative_comment_count",
                "neutral_comment_count",
                "total_comment_count",
                "total_token",
                "createdAt",
            ],
        });

        const remainingTokens = await User.findByPk(userId, { attributes: ["tokens"] });

        res.json({
            totalAnalyses,
            totalComments: totalComments || 0,
            totalTokens: totalTokens || 0,
            sentiment: {
                positive: positive || 0,
                negative: negative || 0,
                neutral: neutral || 0,
            },
            lastAnalyzes,
            remainingTokens: remainingTokens ? remainingTokens.tokens : 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};