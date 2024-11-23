import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";

interface TeamScoreProps {
    title: string;
    score: number;
    incrementScore: () => void;
    decrementScore: () => void;
    resetScore: () => void;
}

export default function TeamScore( {title, score, incrementScore, decrementScore, resetScore}: TeamScoreProps ) {
    return (
        <Card>
            <CardHeader>
                <p>{title} : {score}</p>
            </CardHeader>
            <CardBody>
                <Button onPress={incrementScore}>+1</Button>
                <Button onPress={decrementScore}>-1</Button>
                <Button onPress={resetScore}>Reset</Button>
            </CardBody>
        </Card>
    )
}