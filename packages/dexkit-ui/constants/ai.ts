import {
  AI_MODEL,
  AI_MODEL_TYPE,
  AIModelItem,
  TextImproveAction,
  TextImproveItem,
} from "../types/ai";

export const textImproveItems: TextImproveItem[] = [
  {
    action: TextImproveAction.GENERATE,
    type: AI_MODEL_TYPE.TEXT,
    title: "Generate",
  },
  {
    action: TextImproveAction.IMPROVE_WRITING,
    type: AI_MODEL_TYPE.TEXT,
    title: "Improve writing",
  },
  {
    action: TextImproveAction.IMPROVE_SPELLING,
    type: AI_MODEL_TYPE.TEXT,
    title: "Improve spelling",
  },
  {
    action: TextImproveAction.MAKE_SHORTER,
    type: AI_MODEL_TYPE.TEXT,
    title: "Make shorter",
  },
  {
    action: TextImproveAction.MAKE_LONGER,
    type: AI_MODEL_TYPE.TEXT,
    title: "Make longer",
  },
  {
    action: TextImproveAction.GENERATE_IMAGE,
    type: AI_MODEL_TYPE.IMAGE,
    title: "Generate image",
  },
  {
    action: TextImproveAction.GENERATE_CODE,
    type: AI_MODEL_TYPE.TEXT,
    title: "Generate code",
  },
];

export const aiModelsItems: AIModelItem[] = [
  {
    model: AI_MODEL.GPT_3_5_TURBO,
    type: AI_MODEL_TYPE.TEXT,
  },
  {
    model: AI_MODEL.DALL_E_2,
    type: AI_MODEL_TYPE.IMAGE,
  },
  {
    model: AI_MODEL.CLAUDE_4_SONNET,
    type: AI_MODEL_TYPE.CODE,
  },
  {
    model: AI_MODEL.GPT_4_1,
    type: AI_MODEL_TYPE.CODE,
  },
 /* {
    model: AI_MODEL.GEMINI_2_0_FLASH,
    type: AI_MODEL_TYPE.TEXT,
  },*/
];
