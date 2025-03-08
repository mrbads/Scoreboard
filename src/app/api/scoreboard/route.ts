import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "payload";
import config from "@payload-config";
import wss from "@/server/websocket";

export async function GET(req: NextRequest) {
    const payload = await getPayload({ config });
    const results = await payload.findGlobal({
        slug: 'scoreboard',
    });
    return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
    const payload = await getPayload({ config });
    const { teamAScore, teamBScore } = await req.json();
    const results = await payload.updateGlobal({
        slug: 'scoreboard',
        data: { teamAScore, teamBScore },
    });

    wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'scoreboardUpdated', data: { teamAScore, teamBScore } }));
        }
    });

    return NextResponse.json(results);
}

export async function PATCH(req: NextRequest) {
    const payload = await getPayload({ config });
    const { wedstrijdcode } = await req.json();
    const results = await payload.updateGlobal({
        slug: 'scoreboard',
        data: { wedstrijdcode },
    });

    wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'wedstrijdcodeUpdated', data: { wedstrijdcode } }));
        }
    });

    return NextResponse.json(results);
}