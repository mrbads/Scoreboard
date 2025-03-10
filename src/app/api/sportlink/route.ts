import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const wedstrijdcode = searchParams.get('wedstrijdcode');
    const programma = searchParams.get('programma');
    const clientId = process.env.SPORTLINK_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json({ error: 'Client ID is not set' }, { status: 500 });
    }

    try {
        let response;
        if (programma) {
            response = await fetch(`https://data.sportlink.com/programma?gebruiklokaleteamgegevens=NEE&eigenwedstrijden=JA&thuis=JA&uit=NEE&aantaldagen=6&client_id=${clientId}`);
        } else if (wedstrijdcode) {
            response = await fetch(`https://data.sportlink.com/wedstrijd-informatie?wedstrijdcode=${wedstrijdcode}&client_id=${clientId}`);
        } else {
            return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}