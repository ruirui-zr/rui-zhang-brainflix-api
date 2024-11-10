import express from "express"
import cors from "cors"
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express()
const PORT = process.env.PORT || 8686

app.use(cors());
app.use(express.json());

app.get('/videos', (req, res) => {
    fs.readFile('data/videos.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data from file", err);
            return res.status(500).json({ error: "Error reading file" });
        }
        try {
            const videos = JSON.parse(data).map(video => ({
                id: video.id,
                title: video.title,
                channel: video.channel,
                image: video.image
            }));
            res.json(videos);
        } catch (error) {
            console.error("Error parsing JSON", error);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

app.get('/videos/:id', (req, res) => {
    fs.readFile('data/videos.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data from file", err);
            return res.status(500).json({ error: "Error reading file" });
        }
        try {
            const video = JSON.parse(data).find(v => v.id === req.params.id);
            if (video) {
                res.json(video);
            } else {
                res.status(404).json({ message: 'Video not found' });
            }
        } catch (error) {
            console.error("Error parsing JSON", error);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

app.post('/videos', (req, res) => {
    const { title, description } = req.body;
    console.log('post videos')
    console.log(req.body)

    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
    }

    const newVideo = {
        id: uuidv4(),
        title,
        description,
        channel: "Placeholder Channel",  
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
        views: "0",
        likes: "0",
        duration: "3:00",  
        video: "https://example.com/stream", 
        timestamp: Date.now(),
        comments: [] 
    };

    fs.readFile('data/videos.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data from file", err);
            return res.status(500).json({ error: "Error reading file" });
        }
        try {
            const videos = JSON.parse(data);
            videos.push(newVideo);

            fs.writeFile('data/videos.json', JSON.stringify(videos, null, 2), (err) => {
                if (err) {
                    console.error("Error writing data to file", err);
                    return res.status(500).json({ error: "Error saving new video" });
                }
                res.status(201).json(newVideo);
            });
        } catch (error) {
            console.error("Error parsing JSON", error);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

app.listen(PORT, ()=>{
    console.log(`port listening to ${PORT}`)
})


