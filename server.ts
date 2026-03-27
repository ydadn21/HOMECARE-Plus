import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock IoMT Data Generator
  setInterval(() => {
    const vitals = {
      heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
      spo2: Math.floor(Math.random() * (100 - 94 + 1)) + 94,
      bloodPressure: {
        systolic: Math.floor(Math.random() * (140 - 110 + 1)) + 110,
        diastolic: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
      },
      glucose: (Math.random() * (140 - 80) + 80).toFixed(1),
      timestamp: new Date().toISOString(),
    };
    io.emit("vitals_update", vitals);

    // Emergency simulation (rare)
    if (Math.random() < 0.01) {
      io.emit("emergency_alert", {
        type: "LOW_SPO2",
        value: 88,
        message: "Cảnh báo: Nồng độ oxy máu thấp (SpO2 < 90%)",
      });
    }
  }, 2000);

  // API Routes
  app.get("/api/services", (req, res) => {
    res.json([
      {
        id: "elderly-care",
        title: "Chăm sóc người cao tuổi",
        description: "Theo giờ hoặc nội trú, hỗ trợ sinh hoạt và y tế cơ bản.",
        pricing: [
          { level: "Điều dưỡng", price: "300.000 VNĐ", duration: "30-60 phút" },
          { level: "Kỹ thuật viên", price: "400.000 VNĐ", duration: "30-60 phút" }
        ],
        category: "HomeCare"
      },
      {
        id: "rehab",
        title: "Phục hồi chức năng chuyên sâu",
        description: "Sau đột quỵ (Bạch Mai), hậu phẫu, tập vận động tại nhà.",
        pricing: [
          { level: "Kỹ thuật viên", price: "400.000 - 700.000 VNĐ", duration: "60-120 phút" },
          { level: "Bác sĩ", price: "1.800.000 VNĐ", duration: "6-8h/ngày" }
        ],
        category: "Rehab"
      },
      {
        id: "mother-baby",
        title: "Chăm sóc Mẹ và Bé sau sinh",
        description: "Tắm bé, massage mẹ, hướng dẫn chăm sóc sơ sinh.",
        pricing: [
          { level: "Điều dưỡng", price: "400.000 - 600.000 VNĐ", duration: "60-90 phút" }
        ],
        category: "Maternity"
      }
    ]);
  });

  let notes = [
    {
      id: "1",
      title: "Theo dõi nhịp tim buổi sáng",
      content: "Nhịp tim hơi cao sau khi uống cà phê. Cần giảm bớt caffeine.",
      tags: ["Nhịp tim", "Caffeine"],
      date: "2026-03-27",
      createdAt: new Date().toISOString()
    }
  ];

  app.get("/api/notes", (req, res) => {
    res.json(notes);
  });

  app.post("/api/notes", express.json(), (req, res) => {
    const newNote = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
    notes.push(newNote);
    res.status(201).json(newNote);
  });

  app.put("/api/notes/:id", express.json(), (req, res) => {
    const { id } = req.params;
    notes = notes.map(n => n.id === id ? { ...n, ...req.body } : n);
    res.json(notes.find(n => n.id === id));
  });

  app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    notes = notes.filter(n => n.id !== id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
