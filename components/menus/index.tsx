import AclMenu from './AclMenu';

interface IAclMenuButtonProps {
    label: String;
    leadingIcon: String,
    trailingIcon: String,
    onPress: () => void;
  }
  
  interface IAclMenuProps {
    title: String;
    items: Array<IAclMenuButtonProps>;
  }

export {
    AclMenu,
    IAclMenuButtonProps,
    IAclMenuProps
}