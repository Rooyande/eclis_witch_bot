import express from "express";
import { Telegraf } from "telegraf";

const BOT_TOKEN = "8492144490:AAEYkIIQmiSoALFouUSZH_05N1Gtl2-H05o";
const SUPERGROUP_ID = "-1002614438756";
const bot = new Telegraf(BOT_TOKEN);
const app = express();

const PUBLIC_URL = process.env.PUBLIC_URL;
const PORT = process.env.PORT || 3000;

const MESSAGE_TAGGED = 
شبی که دوازده به صفر
با بام بام بام بام
و صفر به یک تبدیل شد
با بام بام بام بام
شیطانی زاده شد سرشار از خشم
بام بام بام بام بام
به سوی خشم برو ای زاده خشم
بام بام با با با
;

const LINK_URL = "https://postimg.cc/7bS6fZhf";
const SPECIAL_HOURS = [11, 23];
const SPECIAL_MINUTE = 7;

function isSpecialTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return SPECIAL_HOURS.includes(hour) && minute === SPECIAL_MINUTE;
}

bot.on("message", async (ctx) => {
  try {
    const msg = ctx.message;
    if (!msg.text) return;

    const chatType = ctx.chat?.type;
    const text = msg.text.trim();
    const messageId = msg.message_id;

    if (chatType === "private") {
      if (text.includes("ققنوس")) {
        await ctx.reply("🪶 بیا پیوی @tomokage", {
          reply_to_message_id: messageId
        });
      }
      return;
    }

    if ((chatType === "group" || chatType === "supergroup") && msg.entities) {
      const isTargetGroup = ctx.chat?.id.toString() === SUPERGROUP_ID;
      
      if (!isTargetGroup) return;

      const hasMention = msg.entities.some(
        (e) => e.type === "mention" || e.type === "text_mention"
      );

      if (hasMention) {
        if (isSpecialTime()) {
          try {
            await ctx.telegram.sendMessage(
              msg.from.id,
              🔗 <a href="${LINK_URL}">Find out</a>,
              { 
                parse_mode: "HTML",
                disable_web_page_preview: false
              }
            );
            await ctx.reply("📩 پیام خصوصی برات ارسال شد!", {
              reply_to_message_id: messageId
            });
          } catch (error) {
            console.error("خطا در ارسال پیام خصوصی:", error.message);
            await ctx.reply("❌ نمی‌تونم پیام خصوصی برات بفرستم. اول به ربات پیام بدی؟", {
              reply_to_message_id: messageId
            });
          }
        } else {
          await ctx.reply(MESSAGE_TAGGED, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
          });
        }
      }
    }
  } catch (error) {
    console.error("خطا در پردازش پیام:", error);
  }
});

bot.command("start", async (ctx) => {
  await ctx.reply("🤖 ربات فعال است!\n\nدر گروه وقتی منشن بشم، بسته به زمان پاسخ مخصوص میدم!");
});

bot.command("status", async (ctx) => {
  const now = new Date();
  const timeString = now.toLocaleTimeString("fa-IR");
  const isSpecial = isSpecialTime();
  
  await ctx.reply(⏰ زمان فعلی: ${timeString}\n🎯 وضعیت: ${isSpecial ? "زمان خاص 🔥" : "زمان عادی"});
});

const WEBHOOK_PATH = /webhook/${BOT_TOKEN};

app.use(express.json());
app.use((req, res, next) => {
  console.log(${new Date().toISOString()} - ${req.method} ${req.path});
  next();
});

app.use(WEBHOOK_PATH, bot.webhookCallback());

app.get("/", (req, res) => {
  res.json({ 
    status: "✅ Bot is running",
    timestamp: new Date().toISOString(),
    group: SUPERGROUP_ID
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    time: new Date().toISOString(),
    specialTime: isSpecialTime()
  });
});

process.on("unhandledRejection", (error) => {
  console.error("❌ خطای ناشناخته:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ خطای catch نشده:", error);
});

app.listen(PORT, async () => {
  console.log(🚀 سرور روی پورت ${PORT} راه‌اندازی شد);
  
  if (PUBLIC_URL) {
    const webhookURL = ${PUBLIC_URL}${WEBHOOK_PATH};
try {
      await bot.telegram.setWebhook(webhookURL);
      console.log("✅ وب‌هوک تنظیم شد:", webhookURL);
      
      const botInfo = await bot.telegram.getMe();
      console.log(🤖 ربات ${botInfo.username} آماده است);
    } catch (error) {
      console.error("❌ خطا در تنظیم وب‌هوک:", error.message);
    }
  } else {
    console.log("⚠️ حالت polling فعال شد (برای توسعه)");
    bot.launch();
  }
});

export default app;