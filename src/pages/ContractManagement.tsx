import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import Button from "@/components/Button";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuPlus, LuSettings } from "react-icons/lu";
import { TbMoodEmpty } from "react-icons/tb";

// Stores & Hooks (생성되어 있다고 가정)
import { useContractStore } from "@/stores/useContractStore";
import { useContractCategoryStore } from "@/stores/useContractCategoryStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAuthStore } from "@/stores/authStore";
import { useAlert } from "@/components/AlertProvider";
import { useDialog } from "@/hooks/useDialog";

// Components
import ContractDrawer from "@/components/contractManage/ContractDrawer";
import ContractCard from "@/components/contractManage/ContractCard";
import CategorySettingsDrawer from "@/components/contractManage/CategorySettingsDrawer";
import ClientBoardSkeleton from "@/components/clientManage/ClientBoardSkeleton";
import Badge from "@/components/Badge";

const CONTRACT_STATUS = {
  ACTIVE: "active",
  TERMINATED: "terminated",
} as const;

export default function ContractManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentContract, setCurrentContract] = useState<any | null>(null);

  const {
    contracts,
    fetching,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    setContracts,
  } = useContractStore();
  const { categories, fetchCategories } = useContractCategoryStore();
  const { currentCompanyId } = useCompanyStore();
  const { role } = useAuthStore();
  const { showAlert } = useAlert();
  const { openDialog } = useDialog();

  useEffect(() => {
    if (currentCompanyId) {
      fetchContracts(currentCompanyId);
      fetchCategories(currentCompanyId);
    }
  }, [currentCompanyId]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newContracts = [...contracts];
    const draggedItem = newContracts.find((c) => c.id === draggableId);
    if (!draggedItem) return;

    const filtered = newContracts.filter((c) => c.id !== draggableId);
    const updatedItem = {
      ...draggedItem,
      status: destination.droppableId as "active" | "terminated",
    };

    setContracts([...filtered, updatedItem]);

    if (currentCompanyId) {
      if (destination.droppableId !== source.droppableId) {
        showAlert("계약 상태가 변경되었습니다.", { type: "success" });
      }
      await updateContract(draggableId, { status: updatedItem.status });
    }
  };

  if (fetching) return <ClientBoardSkeleton />;

  return (
    <>
      <FlexWrapper classes="mb-4 lg:mb-6" items="center" justify="between">
        <Typography variant="H3" classes="text-xl lg:text-2xl">
          계약 관리
        </Typography>

        {role === "admin" && (
          <FlexWrapper gap={2}>
            <Button
              variant="outline"
              size="md"
              classes="gap-1 !px-2 lg:!px-3 text-sm"
              onClick={() => setCategoryDrawerOpen(true)}
            >
              <LuSettings className="text-lg" />
              분류 설정
            </Button>
            <Button
              variant="contain"
              color="green"
              size="md"
              classes="gap-1 !px-2 lg:!px-3 text-sm"
              onClick={() => {
                setDrawerMode("create");
                setCurrentContract(null);
                setDrawerOpen(true);
              }}
            >
              <LuPlus className="text-lg" />
              계약 추가
            </Button>
          </FlexWrapper>
        )}
      </FlexWrapper>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:h-[calc(100dvh-76px-36px-16px-24px)] overflow-y-auto lg:overflow-visible">
          {/* 1. 계약 중 (그리드) */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[400px] lg:min-h-0">
            <FlexWrapper items="center" gap={2} classes="mb-3 lg:mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Typography variant="H4">계약 중</Typography>
              <Badge color="green" size="md">
                {contracts.filter((c) => c.status === "active").length}
              </Badge>
            </FlexWrapper>

            <Droppable
              droppableId={CONTRACT_STATUS.ACTIVE}
              direction="horizontal"
            >
              {(provided) => {
                const activeItems = contracts.filter(
                  (c) => c.status === "active"
                );
                const isEmpty = activeItems.length === 0;
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white border rounded-xl p-3 lg:p-4 overflow-y-auto w-full h-full 
                      ${isEmpty ? "flex flex-col items-center justify-center" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start"}`}
                  >
                    {!isEmpty ? (
                      activeItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(p) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              className="h-fit"
                              onClick={() => {
                                setDrawerMode("edit");
                                setCurrentContract(item);
                                setDrawerOpen(true);
                              }}
                            >
                              <ContractCard
                                contract={item}
                                category={categories.find(
                                  (cat) => cat.id === item.category_id
                                )}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center text-gray-400">
                        <TbMoodEmpty className="text-4xl mb-2 mx-auto" />
                        <p className="text-sm">진행 중인 계약이 없습니다</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

          {/* 2. 계약 종료 (사이드바) */}
          <div className="w-full lg:w-[340px] flex flex-col flex-shrink-0 min-h-[200px] lg:min-h-0">
            <FlexWrapper items="center" gap={2} classes="mb-3 lg:mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <Typography variant="H4">계약 종료</Typography>
              <Badge color="green" size="md">
                {contracts.filter((c) => c.status === "terminated").length}
              </Badge>
            </FlexWrapper>

            <Droppable droppableId={CONTRACT_STATUS.TERMINATED}>
              {(provided) => {
                const terminatedItems = contracts.filter(
                  (c) => c.status === "terminated"
                );
                const isEmpty = terminatedItems.length === 0;
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white border rounded-xl p-3 overflow-y-auto flex flex-col gap-3 max-h-[400px] lg:max-h-none lg:h-full
                      ${isEmpty ? "items-center justify-center" : ""}`}
                  >
                    {!isEmpty ? (
                      terminatedItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(p) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              onClick={() => {
                                setDrawerMode("edit");
                                setCurrentContract(item);
                                setDrawerOpen(true);
                              }}
                            >
                              <ContractCard
                                contract={item}
                                category={categories.find(
                                  (cat) => cat.id === item.category_id
                                )}
                                isTerminated
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 opacity-60">
                        <TbMoodEmpty className="text-4xl mb-2 mx-auto" />
                        <p className="text-sm">종료된 계약이 없습니다</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      <ContractDrawer
        open={drawerOpen}
        mode={drawerMode}
        contract={currentContract}
        categories={categories}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentContract(null);
        }}
        // ✅ missing onSubmit 추가
        onSubmit={async (data) => {
          if (!currentCompanyId) return;

          if (drawerMode === "create") {
            // 새 계약 생성
            await createContract(
              currentCompanyId,
              data as Contract.CreateContractInput
            );
            showAlert("계약이 추가되었습니다.", { type: "success" });
          } else if (drawerMode === "edit" && currentContract) {
            // 기존 계약 수정
            await updateContract(currentContract.id, data);
            showAlert("계약 정보가 수정되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        // ✅ 삭제 로직도 필요한 경우 추가
        onDelete={
          drawerMode === "edit"
            ? async () => {
                await openDialog({
                  title: "계약 삭제",
                  message: `"${currentContract?.title}" 계약을 삭제하시겠습니까?`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    if (currentContract) {
                      await deleteContract(currentContract.id);
                      showAlert("삭제되었습니다.", { type: "success" });
                    }
                    setDrawerOpen(false);
                    return true;
                  },
                });
              }
            : undefined
        }
      />
      <CategorySettingsDrawer
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
      />
    </>
  );
}
