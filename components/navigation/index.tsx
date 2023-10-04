import AclNavigationTab from './AclNavigationTab';

interface IAclNavigationTabItem {
  name: string,
  label: string,
  icon: string,
  headerShown: boolean,
  component: React.FunctionComponent<any>,
  options: any
}

interface IAclNavigationTabProps {
  tabBarActiveTintColor: string,
  tabBarInactiveTintColor: string,
  items: Array<IAclNavigationTabItem>;
  close: () => void;
}

export {
    AclNavigationTab,
    IAclNavigationTabItem,
    IAclNavigationTabProps
}