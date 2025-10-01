export type OpenFilePickerOptions = {
  /**
   * A boolean value that defaults to false. By default the picker should include an
   * option to not apply any file type filters (instigated with the type option below).
   * Setting this option to true means that option is not available.
   */
  excludeAcceptAllOption?: boolean;

  /**
   * By specifying an ID, the browser can remember different directories for
   * different IDs. If the same ID is used for another picker, the picker opens
   * in the same directory.
   */
  id?: string;

  /**
   * A boolean value that defaults to false. When set to true multiple files may be selected.
   */
  multiple?: boolean;

  /**
   * A FileSystemHandle or a well known directory ("desktop", "documents", "downloads",
   * "music", "pictures", or "videos") to open the dialog in.
   */
  startIn?: FileSystemHandle | AuthorizedFolders;

  /**
   * An Array of allowed file types to pick. Each item is an object with the following options:
   */
  types?: FilePickerAllowedTypes[];
};

export type SaveFilePickerOptions = {
  /**
   * A boolean value that defaults to false. By default, the picker should include an option to
   * not apply any file type filters (instigated with the type option below). Setting this option
   * to true means that option is not available.
   */
  excludeAcceptAllOption?: boolean;

  /**
   * By specifying an ID, the browser can remember different directories for
   * different IDs. If the same ID is used for another picker, the picker opens
   * in the same directory.
   */
  id?: string;

  /**
   * A boolean value that defaults to false. When set to true multiple files may be selected.
   */
  suggestedName?: string;

  /**
   * A FileSystemHandle or a well known directory ("desktop", "documents", "downloads",
   * "music", "pictures", or "videos") to open the dialog in.
   */
  startIn?: FileSystemHandle | AuthorizedFolders;

  /**
   * An Array of allowed file types to pick. Each item is an object with the following options:
   */
  types?: FilePickerAllowedTypes[];
};

export type FilePickerAllowedTypes = {
  /**
   * An optional description of the category of files types allowed. Defaults to an empty string.
   */
  description?: string;

  /**
   * An Object with the keys set to the MIME type and the values an Array of file extensions (see below for an example).
   */
  accept: Record<string, string[]>;
};

export type FilePickerAcceptTypes = Record<string, string[]>;
export type AuthorizedFolders = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ESModule<T = any> = {
  default: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebStorage<T extends Record<string, any> = Record<string, any>> = {
  get<K extends keyof T>(key: K): T[K] | null;
  set<K extends keyof T>(key: K, value: T[K]): void;
  remove(key: keyof T): void;
  clear(): void;
  has(key: keyof T): boolean;
};
