// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { fireEvent, render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ReleaseSetting } from "../../src/components/ReleaseSetting";
import {
  releaseAt,
  setImages,
  setImageUri,
  setIsReleased,
  setReleaseAt,
  setService,
} from "../../src/signal";
import { ImageItem, Setting } from "../../src/type";

describe("<ReleaseSetting />", () => {
  beforeEach(() => {
    setIsReleased(false);
    setImageUri(undefined);
    setReleaseAt(undefined);
    setService("service1");
    setImages([
      {
        service: "service1",
        repository: "hoge",
        digest:
          "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
        pushed_at: new Date(),
        repository_name: "hoge",
        size: 10000,
        tags: ["latest", "hogera"],
        uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      } as ImageItem,
    ]);
    // フェイクタイマーを使う
    vi.useFakeTimers();
    const date = new Date(2022, 0, 1, 0, 0);
    vi.setSystemTime(date);
  });
  afterEach(() => {
    // 正しいタイマーに戻す
    vi.useRealTimers();
  });
  // テスト 1 つ目
  test("任意のリリース時間をセット", async () => {
    const { container, findByText, unmount } = render(() => <ReleaseSetting />);
    const expectedReleaseUri = (await findByText(
      "次回リリースイメージ URI"
    )) as HTMLElement;
    expect(expectedReleaseUri).toHaveTextContent("次回リリースイメージ URI");
    const expectedReleaseAt = (await findByText(
      "次回リリース日時"
    )) as HTMLElement;
    expect(expectedReleaseAt).toHaveTextContent("次回リリース日時");
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // 日付指定
    setReleaseAt(new Date(2022, 8, 11, 21, 1));
    // 日付指定後のスナップショット
    const htmlAfterTimeSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterTimeSet).toMatchSnapshot();
    // イメージ URI 指定
    const dummyUri =
      "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest";
    setImageUri(dummyUri);
    const expectedReleaseUriValue = (await findByText(dummyUri)) as HTMLElement;
    expect(expectedReleaseUriValue).toHaveTextContent(dummyUri);
    // イメージ URI 指定後のスナップショット
    const htmlAfterUriSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterUriSet).toMatchSnapshot();
    // 次回リリースをセット（ボタンクリック）は confirm()（要 Enter key）があるので一旦省略
    unmount();
  });
  // テスト 2 つ目
  test("翌朝 04:05 ボタンをクリック", async () => {
    const { container, findByText, findByTitle, unmount } = render(() => (
      <ReleaseSetting />
    ));
    const expectedReleaseUri = (await findByText(
      "次回リリースイメージ URI"
    )) as HTMLElement;
    expect(expectedReleaseUri).toHaveTextContent("次回リリースイメージ URI");
    const expectedReleaseAt = (await findByText(
      "次回リリース日時"
    )) as HTMLElement;
    expect(expectedReleaseAt).toHaveTextContent("次回リリース日時");
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // 翌朝 04:05 ボタンクリック
    const button = (await findByTitle("翌朝リリースする")) as HTMLInputElement;
    expect(button).toHaveTextContent("翌朝 04:05");
    fireEvent.click(button);
    expect(releaseAt()).toStrictEqual(new Date(2022, 0, 2, 4, 5));
    // 日付指定後のスナップショット
    const htmlAfterTimeSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterTimeSet).toMatchSnapshot();
    // イメージ URI 指定
    const dummyUri =
      "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga:latest";
    setImageUri(dummyUri);
    const expectedReleaseUriValue = (await findByText(dummyUri)) as HTMLElement;
    expect(expectedReleaseUriValue).toHaveTextContent(dummyUri);
    // イメージ URI 指定後のスナップショット
    const htmlAfterUriSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterUriSet).toMatchSnapshot();
    // 次回リリースをセット（ボタンクリック）は confirm()（要 Enter key）があるので一旦省略
    unmount();
  });
  // テスト 3 つ目
  test("即時リリースボタンをクリック", async () => {
    const { container, findByText, findByTitle, unmount } = render(() => (
      <ReleaseSetting />
    ));
    const expectedReleaseUri = (await findByText(
      "次回リリースイメージ URI"
    )) as HTMLElement;
    expect(expectedReleaseUri).toHaveTextContent("次回リリースイメージ URI");
    const expectedReleaseAt = (await findByText(
      "次回リリース日時"
    )) as HTMLElement;
    expect(expectedReleaseAt).toHaveTextContent("次回リリース日時");
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // 即時リリースボタンクリック
    const button = (await findByTitle("即時リリースする")) as HTMLInputElement;
    expect(button).toHaveTextContent("現在（即時リリースする）");
    fireEvent.click(button);
    expect(releaseAt()).toStrictEqual(new Date(2022, 0, 1, 0, 0));
    // 日付指定後のスナップショット
    const htmlAfterTimeSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterTimeSet).toMatchSnapshot();
    // イメージ URI 指定
    const dummyUri =
      "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga:latest";
    setImageUri(dummyUri);
    const expectedReleaseUriValue = (await findByText(dummyUri)) as HTMLElement;
    expect(expectedReleaseUriValue).toHaveTextContent(dummyUri);
    // イメージ URI 指定後のスナップショット
    const htmlAfterUriSet = formatSnapshot(container.innerHTML);
    expect(htmlAfterUriSet).toMatchSnapshot();
    // 次回リリースをセット（ボタンクリック）は confirm()（要 Enter key）があるので一旦省略
    unmount();
  });
});
