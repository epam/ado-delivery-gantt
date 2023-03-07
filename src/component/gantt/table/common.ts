const localeDateStringCache: { [key: string]: any } = {};
const defaultDateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
  };

export const toLocaleDateStringFactory =
  (locale: string) =>
    (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions = defaultDateTimeOptions) => {
      const key = date.toString();
      let lds = localeDateStringCache[key];
      if (!lds) {
        lds = date.toLocaleDateString(locale, dateTimeOptions);
        localeDateStringCache[key] = lds;
      }
      return lds;
    };
