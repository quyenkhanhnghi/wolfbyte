"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export function Chatbot() {
  useEffect(() => {
    Crisp.configure("1611d925-7c61-420d-92f6-11eb0b567670");
  }, []);
  return null;
}
