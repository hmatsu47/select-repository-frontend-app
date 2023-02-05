import { describe, expect, test, vi } from "vitest";
import { fireEvent, render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ReleaseSetting } from "../../src/components/ReleaseSetting";
import {
  releaseAt,
  setImages,
  setImageUri,
  setIsReleased,
  setIsReleaseSelected,
  setReleaseAt,
  setService,
  isCancel,
  isOpenedConfirm,
  setIsCancel,
  setIsOpenedConfirm,
} from "../../src/signal";
import { ImageItem } from "../../src/type";

describe("<ReleaseSetting />", () => {
  beforeEach(() => {
    // フェイクタイマーを使う
    vi.useFakeTimers();
    const date = new Date(2022, 0, 1, 0, 0);
    vi.setSystemTime(date);
  });
  afterEach(() => {
    // 正しいタイマーに戻す
    vi.useRealTimers();
  });
  const buttonList = [
    {
      title: "任意のリリース時間をセット",
      buttonTitle: null,
      text: null,
      expected: new Date(2022, 8, 11, 21, 1),
    },
    {
      title: "翌朝リリースするボタンをクリック",
      buttonTitle: "翌朝リリースする",
      text: "翌朝 04:05",
      expected: new Date(2022, 0, 2, 4, 5),
    },
    {
      title: "即時リリースするボタンをクリック",
      buttonTitle: "即時リリースする",
      text: "現在（即時リリースする）",
      expected: new Date(2022, 0, 1, 0, 0),
    },
  ];
  buttonList.forEach((testCase) => {
    test(testCase.title, async () => {
      setIsReleased(false);
      setImageUri(undefined);
      setReleaseAt(undefined);
      setIsReleaseSelected(true); // false のテストケースが入ると失敗するので true のみ
      setIsCancel(false);
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
      if (testCase.text) {
        // ボタンクリック
        const button = (await findByTitle(
          testCase.buttonTitle
        )) as HTMLInputElement;
        expect(button).toHaveTextContent(testCase.text);
        fireEvent.click(button);
        expect(releaseAt()).toStrictEqual(testCase.expected);
      } else {
        // 日付指定
        setReleaseAt(testCase.expected);
      }
      // 日付指定後のスナップショット
      const htmlAfterTimeSet = formatSnapshot(container.innerHTML);
      expect(htmlAfterTimeSet).toMatchSnapshot();
      // イメージ URI 指定
      const dummyUri =
        "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest";
      setImageUri(dummyUri);
      const expectedReleaseUriValue = (await findByText(
        dummyUri
      )) as HTMLElement;
      expect(expectedReleaseUriValue).toHaveTextContent(dummyUri);
      // イメージ URI 指定後のスナップショット
      const htmlAfterUriSet = formatSnapshot(container.innerHTML);
      expect(htmlAfterUriSet).toMatchSnapshot();
      // 次回リリースをセット
      const buttonReleaseSet = (await findByTitle(
        "次回リリースをセット"
      )) as HTMLInputElement;
      fireEvent.click(buttonReleaseSet);
      expect(buttonReleaseSet).toHaveTextContent(
        "指定のイメージ URI と日時をセット"
      );
      expect(isCancel()).toBe(false);
      expect(isOpenedConfirm()).toBe(true);
      // 次回リリースを取り消し
      setIsOpenedConfirm(false);
      const buttonReleaseReset = (await findByTitle(
        "次回リリースを取り消し"
      )) as HTMLInputElement;
      fireEvent.click(buttonReleaseReset);
      expect(buttonReleaseReset).toHaveTextContent("リリースを取り消し");
      expect(isCancel()).toBe(true);
      expect(isOpenedConfirm()).toBe(true);
      unmount();
    });
  });
});
