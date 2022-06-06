import Logger from "./Logger";
import opener from "opener";

export const open = (uri: string, logger: Logger) => {
  try {
    opener(uri);
  } catch (err) {
    logger.debug(`Opener failed to open "${uri}":\n${err}`);
  }
};
