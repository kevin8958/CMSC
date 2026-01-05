import { useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useContractCategoryStore } from "@/stores/useContractCategoryStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
export default function CategorySettingsDrawer({ open, onClose }: any) {
  const [newName, setNewName] = useState("");
  const { categories, createCategory, deleteCategory } =
    useContractCategoryStore();
  const { currentCompanyId } = useCompanyStore();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="계약 분류 설정"
      showFooter={false}
    >
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Typography variant="B2" classes="font-bold text-gray-600">
            새 분류 추가
          </Typography>
          <FlexWrapper gap={2}>
            <TextInput
              classes="flex-1"
              inputProps={{
                value: newName,
              }}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="분류명 입력"
            />
            <Button
              size="lg"
              color="green"
              onClick={() => {
                if (!currentCompanyId || !newName.trim()) return;
                createCategory(currentCompanyId, newName);
                setNewName("");
              }}
              classes="shrink-0"
            >
              추가
            </Button>
          </FlexWrapper>
        </div>

        <div className="space-y-2">
          <Typography
            variant="B2"
            classes="font-bold text-gray-600 border-b pb-1"
          >
            현재 분류 목록
          </Typography>
          <div className="flex flex-col gap-2">
            {categories.map((cat: any) => (
              <FlexWrapper
                key={cat.id}
                justify="between"
                items="center"
                classes="p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <FlexWrapper gap={2} items="center">
                  {/* 컬러 프리뷰 원형 점 */}
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Typography variant="B1" classes="font-medium text-gray-700">
                    {cat.name}
                  </Typography>
                </FlexWrapper>
                <Button
                  variant="clear"
                  classes="!text-red-400"
                  onClick={() => deleteCategory(cat.id)}
                >
                  삭제
                </Button>
              </FlexWrapper>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
