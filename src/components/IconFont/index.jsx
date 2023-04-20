import { createFromIconfontCN } from '@ant-design/icons';
//import scriptUrl from '@/renderer/assets/font_source/iconfont';
// <IconFont type="icon-tuichu" />
import font from './font/iconfont'

const IconFont = createFromIconfontCN({
  scriptUrl: font,
});

export default IconFont;
