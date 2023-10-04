import AclModalImage from './AclModalImage';
import { IAclMenuButtonProps } from '../../components/menus';

interface IAclModalImageProps {
  uri: string;
  show: boolean;
  //options: object;
  close: () => void;
  items: Array<IAclMenuButtonProps>;
}

export {
  AclModalImage,
  IAclModalImageProps
}