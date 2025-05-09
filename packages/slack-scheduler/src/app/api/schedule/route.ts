import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";

const token = process.env.SLACK_BOT_TOKEN;

if (!token || token === 'your-slack-bot-token-here') {
  console.error('Invalid or missing SLACK_BOT_TOKEN');
}

const slack = new WebClient(token);

export async function POST(req: Request) {
  try {
    if (!token || token === 'your-slack-bot-token-here') {
      return NextResponse.json(
        { error: 'Slack bot token not properly configured' },
        { status: 401 }
      );
    }

    const { channel, message, delayMinutes } = await req.json();
    
    // Calculate scheduled time
    const scheduleTime = new Date(Date.now() + delayMinutes * 60000);

    // Schedule the message
    await slack.chat.scheduleMessage({
      channel,
      text: message,
      post_at: Math.floor(scheduleTime.getTime() / 1000),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling message:", error);
    return NextResponse.json(
      { error: "Failed to schedule message" },
      { status: 500 }
    );
  }
}
