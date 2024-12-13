"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();
    return (
        <button className="btn" onClick={() => router.push("/")}>
            <img src="/arrow/arrow.svg" alt=""/>
        </button>
    );
}
