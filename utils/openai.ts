// import { OPENAI_API_KEY } from "@env";

// export async function transcribeAudio(uri: string): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", {
//     uri,
//     type: "audio/m4a",
//     name: "audio.m4a",
//   });
//   formData.append("model", "whisper-1");

//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/audio/transcriptions",
//       {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//         },
//       }
//     );

//     const data = await response.json();
//     return data.text || "Failed to transcribe audio";
//   } catch (error) {
//     console.error("Transcription error:", error);
//     return "Failed to transcribe audio";
//   }
// }
