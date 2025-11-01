export type StructureFormat = 'pdb' | 'mmcif' | 'sdf';

export interface StructureUrl {
  name: string;
  url: string;
  format?: StructureFormat;
}

export interface LoadedStructure {
  name: string;
  data: string;
  format: StructureFormat;
}

