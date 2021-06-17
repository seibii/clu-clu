export const dictionary = (column: string): string => {
  switch (column) {
    case 'email':
      return 'メールアドレス';
    case 'phoneNumber':
      return '電話番号';
    case 'name':
      return '氏名';
    case 'kanaName':
      return '氏名(かな)';
    default:
      return column;
  }
};
