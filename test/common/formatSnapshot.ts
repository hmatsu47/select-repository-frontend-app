// スナップショットを整形する（インラインスタイル名と改行）
export const formatSnapshot = (snapshot: string) => {
  return snapshot.replace(/css-\w{6}/g, "css-xxxxxx");
};
