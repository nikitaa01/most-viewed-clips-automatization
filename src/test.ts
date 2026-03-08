import { CLIPS_AUDIO_DIR_PATH } from "./constants/paths";
import { analyzeClipsAudio } from "./steps/analyze-clips-audio";
import { readClips } from "./utils/read-clips";
/* 
const paths = [
  `${CLIPS_AUDIO_DIR_PATH}/DeadBlitheStingrayGrammarKing-tnBcbsfZBoYJwt6e.m4a`, // Really quiet music
  //`${CLIPS_AUDIO_DIR_PATH}/OutstandingAgileEggnogBudStar-rpR5U-2pYXgKFqIX.m4a`, // Not bad clip but rejected
  `${CLIPS_AUDIO_DIR_PATH}/ZealousPlainYogurtPanicVis-KtCtJO_W4fikyPAY.m4a`, // Really quiet music
]; */

const clips = await readClips();
const paths = clips.map((clip) => `${CLIPS_AUDIO_DIR_PATH}/${clip.id}.m4a`);
await analyzeClipsAudio(paths);
