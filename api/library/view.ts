import { serveLibraryFile } from "../_lib/libraryFile.js";

export const GET = (req: Request) => serveLibraryFile(req, "view");