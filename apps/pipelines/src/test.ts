import { s3Client } from "@/lib/s3";
/* 
const paths = [
  `${CLIPS_AUDIO_DIR_PATH}/DeadBlitheStingrayGrammarKing-tnBcbsfZBoYJwt6e.m4a`, // Really quiet music
  //`${CLIPS_AUDIO_DIR_PATH}/OutstandingAgileEggnogBudStar-rpR5U-2pYXgKFqIX.m4a`, // Not bad clip but rejected
  `${CLIPS_AUDIO_DIR_PATH}/ZealousPlainYogurtPanicVis-KtCtJO_W4fikyPAY.m4a`, // Really quiet music
]; */

console.log(await s3Client.list());

/* const clips = await readClips();
const paths = clips.map((clip) => `${CLIPS_AUDIO_DIR_PATH}/${clip.id}.m4a`);
await analyzeClipsAudio(paths); */
