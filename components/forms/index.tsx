import AclForm from './AclForm';

interface IAclFormFieldProps {
    data: object;
    key: number,
    options: object;
    change: () => void;
  }
  
  interface IAclFormDataProps {
    fields: Array<IAclFormFieldProps>;
    submit: () => void;
  }
  interface IAclFormProps {
    title: string;
    data: IAclFormDataProps;
    options: object;
    fields: Array<IAclFormFieldProps>;
    submit: () => void;
  }
export {
    IAclFormFieldProps,
    IAclFormDataProps,
    IAclFormProps,
    AclForm,
}