// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockPost } from "vi-fetch";
import { fireEvent, render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { Confirm } from "../../src/components/Confirm";
import { baseUri } from "../../src/api/apiHandler";
import { updateSetting } from "../../src/api/updateSetting";
import {
  imageUri,
  isOpenedConfirm,
  isReleased,
  releaseAt,
  service,
  setImageUri,
  setIsOpenedConfirm,
  setIsReleased,
  setReleaseAt,
  setService,
} from "../../src/signal";
import { Setting } from "../../src/type";

describe("<Confirm />", () => {
  const confirmList = [
    {
      title: "はい・過去リリースあり",
      buttonYes: true,
      service: "hoge",
      isReleased: true,
      imageUri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      releaseAt: new Date(2022, 0, 1, 0, 0),
      testFetch: true,
    },
    {
      title: "はい・過去リリースなし",
      buttonYes: true,
      service: "hoge",
      isReleased: false,
      imageUri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      releaseAt: new Date(2022, 0, 1, 0, 0),
      testFetch: true,
    },
    {
      title: "いいえ・過去リリースあり",
      buttonYes: false,
      service: "hoge",
      isReleased: true,
      imageUri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      releaseAt: new Date(2022, 0, 1, 0, 0),
      testFetch: false,
    },
  ];
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  confirmList.forEach((testCase) => {
    test(testCase.title, async () => {
      setService(testCase.service);
      setIsReleased(testCase.isReleased);
      setImageUri(testCase.imageUri);
      setReleaseAt(testCase.releaseAt);
      setIsOpenedConfirm(true);
      const mock = mockPost(`${baseUri}/setting/${service()}`)
        .withHeaders([["Content-Type", "application/json;charset=utf8"]])
        .willResolve({
          image_uri: testCase.imageUri,
          is_released: testCase.isReleased,
          release_at: testCase.releaseAt,
        } as Setting);
      await updateSetting();
      const { findByTitle, unmount } = render(() => <Confirm />);
      // はいボタン
      const buttonYes = (await findByTitle("はい")) as HTMLInputElement;
      expect(buttonYes).toHaveTextContent("はい");
      // いいえボタン
      const buttonNo = (await findByTitle("いいえ")) as HTMLInputElement;
      expect(buttonNo).toHaveTextContent("いいえ");
      const modal = (await findByTitle("modal")) as HTMLElement;
      // css の名前が動的に変わるので固定値に置換
      const htmlModal = formatSnapshot(modal.innerHTML);
      expect(htmlModal).toMatchSnapshot();
      // ボタンクリック
      fireEvent.click(testCase.buttonYes ? buttonYes : buttonNo);
      // API 呼び出しチェック
      if (testCase.testFetch) {
        // とりあえず呼び出しが行われたことだけを確認
        expect(mock).toHaveFetched();
        expect(mock).toHaveFetchedWithBody(
          JSON.stringify({
            image_uri: imageUri(),
            is_released: isReleased(),
            release_at: releaseAt(),
          } as Setting)
        );
      }
      // モーダルクローズ
      expect(isOpenedConfirm()).toBe(false);
      unmount();
    });
  });
});
