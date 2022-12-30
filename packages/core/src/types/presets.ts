import type { BaseConfig } from './index'

export interface Presets<Theme extends {} = {}> extends Pick<BaseConfig<Theme>, 'variants' | 'shortcuts' | 'theme' | 'rules' | 'blocked' | 'preprocess'> {}
