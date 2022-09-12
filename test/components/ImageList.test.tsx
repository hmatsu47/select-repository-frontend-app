// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import "vi-fetch/setup";
import { fireEvent, render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ImageList } from "../../src/components/ImageList";
import {
  imageUri,
  setImages,
  setImageUri,
  setReleaseAt,
  setRepository,
  setRepositoryUri,
} from "../../src/signal";
import { ImageItem } from "../../src/type";

describe("<ImageList />", () => {
  // 一覧表示されるケース
  const imageCheckList = [
    {
      title: "タグありの URI をセット",
      uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
    },
    {
      title: "タグなしの URI をセット",
      uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
    },
  ];
  imageCheckList.forEach((testCase) => {
    test(testCase.title, async () => {
      setImageUri(undefined);
      setReleaseAt(undefined);
      setRepository("hoge");
      setRepositoryUri(
        "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge"
      );
      setImages([
        {
          service: "service1",
          repository: "hoge",
          digest:
            "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
          pushed_at: new Date(2022, 8, 12, 14, 45),
          repository_name: "hoge",
          size: 10000,
          tags: ["latest", "hogera"],
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
        } as ImageItem,
        {
          service: "service1",
          repository: "hoge",
          digest:
            "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
          pushed_at: new Date(2022, 8, 12, 14, 45),
          repository_name: "hoge",
          size: 2000000,
          tags: undefined,
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
        } as ImageItem,
      ]);
      const { container, findByText, findByTitle, unmount } = render(() => (
        <ImageList />
      ));
      const expectedListedUri = (await findByText(testCase.uri)) as HTMLElement;
      expect(expectedListedUri).toHaveTextContent(testCase.uri);
      // css の名前が動的に変わるので固定値に置換
      const htmlBefore = formatSnapshot(container.innerHTML);
      expect(htmlBefore).toMatchSnapshot();
      // ボタンクリック
      const button = (await findByTitle(
        `${testCase.uri} を選択`
      )) as HTMLInputElement;
      expect(button).toHaveTextContent("選択");
      fireEvent.click(button);
      expect(imageUri()).toBe(testCase.uri);
      // イメージ URI 指定後のスナップショット
      const htmlAfterUriSelect = formatSnapshot(container.innerHTML);
      expect(htmlAfterUriSelect).toMatchSnapshot();
      // 脆弱性スキャン結果表示リンクのテストは省略
      unmount();
    });
  });
  // 一覧表示されないケース（イメージなし）
  test("一覧未表示（イメージなし）", async () => {
    // すべて無指定
    setRepository("hoge");
    setRepositoryUri("000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge");
    setImages(null);
    const { container, findByText, unmount } = render(() => <ImageList />);
    const expected = (await findByText(
      "リポジトリにイメージがありません"
    )) as HTMLElement;
    // あえて expect は用意せず（完全一致しないので）
    // css の名前が動的に変わるので固定値に置換
    const html = formatSnapshot(container.innerHTML);
    expect(html).toMatchSnapshot();
    unmount();
  });
});
