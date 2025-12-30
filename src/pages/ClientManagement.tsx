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
import { LuPlus } from "react-icons/lu";
import { TbMoodEmpty } from "react-icons/tb";

// Stores & Hooks
import { useClientStore } from "@/stores/useClientStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useAuthStore } from "@/stores/authStore";
import { useAlert } from "@/components/AlertProvider";
import { useDialog } from "@/hooks/useDialog";

// Components
import ClientDrawer from "@/components/clientManage/ClientDrawer";
import ClientCard from "@/components/clientManage/ClientCard";
import ClientBoardSkeleton from "@/components/clientManage/ClientBoardSkeleton";
import Badge from "@/components/Badge";

const CLIENT_STATUS = {
  ACTIVE: "active",
  TERMINATED: "terminated",
} as const;

export default function ClientManagement() {
  // 1. States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentClient, setCurrentClient] = useState<Client.Client | null>(
    null
  );

  // 2. Stores
  const {
    clients,
    fetching,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setClients,
  } = useClientStore();
  const { currentCompanyId } = useCompanyStore();
  const { allList: workers, fetchAll } = useWorkerStore();
  const { role } = useAuthStore();
  const { showAlert } = useAlert();
  const { openDialog } = useDialog();

  // 3. Initial Fetch
  useEffect(() => {
    if (currentCompanyId) {
      fetchClients(currentCompanyId);
      fetchAll(currentCompanyId);
    }
  }, [currentCompanyId]);

  // 4. Drag and Drop Handler
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newClients = [...clients];
    const draggedItem = newClients.find((c) => c.id === draggableId);
    if (!draggedItem) return;

    const filtered = newClients.filter((c) => c.id !== draggableId);
    const updatedItem = {
      ...draggedItem,
      status: destination.droppableId as "active" | "terminated",
    };

    setClients([...filtered, updatedItem]);

    if (currentCompanyId) {
      if (destination.droppableId !== source.droppableId) {
        showAlert("거래 상태가 변경되었습니다.", { type: "success" });
      }
      await updateClient(draggableId, { status: updatedItem.status });
    }
  };

  if (fetching) return <ClientBoardSkeleton />;

  return (
    <>
      {/* 헤더 영역 */}
      <FlexWrapper classes="mb-6" items="center" justify="between">
        <Typography variant="H3">거래처 관리</Typography>
        {role === "admin" && (
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-3"
            onClick={() => {
              setDrawerMode("create");
              setCurrentClient(null);
              setDrawerOpen(true);
            }}
          >
            <LuPlus className="text-lg" />
            거래처 추가
          </Button>
        )}
      </FlexWrapper>

      {/* 보드 영역 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full gap-6 h-[calc(100dvh-76px-36px-16px-24px)]">
          {/* 1. 왼쪽: 거래 중 (Grid Layout) */}
          <div className="flex-1 flex flex-col min-w-0">
            <FlexWrapper items="center" gap={2} classes="mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Typography variant="H4">거래 중</Typography>
              <Badge color="green" size="md">
                {clients.filter((c) => c.status === "active").length}
              </Badge>
            </FlexWrapper>
            <Droppable
              droppableId={CLIENT_STATUS.ACTIVE}
              direction="horizontal"
            >
              {(provided) => {
                const activeClients = clients.filter(
                  (c) => c.status === "active"
                );
                const isEmpty = activeClients.length === 0;

                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
          bg-white border border-dashed rounded-xl p-4 overflow-y-auto w-full h-full
          ${
            isEmpty
              ? "flex flex-col items-center justify-center" // 데이터 없을 때: 중앙 정렬
              : "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 content-start" // 데이터 있을 때: 그리드
          }
        `}
                  >
                    {!isEmpty ? (
                      activeClients.map((client, index) => (
                        <Draggable
                          key={client.id}
                          draggableId={client.id}
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
                                setCurrentClient(client);
                                setDrawerOpen(true);
                              }}
                            >
                              <ClientCard client={client} workers={workers} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      /* 데이터 없음 표시: 부모가 flex이므로 이제 중앙에 위치합니다 */
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <TbMoodEmpty className="text-4xl mb-2" />
                        <p className="text-sm font-medium">
                          거래 중인 업체가 없습니다
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

          {/* 2. 오른쪽: 거래 종료 (Sidebar Column Layout) */}
          <div className="w-[340px] flex flex-col flex-shrink-0">
            <FlexWrapper items="center" gap={2} classes="mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <Typography variant="H4">거래 종료</Typography>
              <Badge color="green" size="md">
                {clients.filter((c) => c.status === "terminated").length}
              </Badge>
            </FlexWrapper>

            <Droppable droppableId={CLIENT_STATUS.TERMINATED}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white border rounded-xl p-3 overflow-y-auto flex flex-col gap-3 h-full"
                >
                  {clients
                    .filter((c) => c.status === CLIENT_STATUS.TERMINATED)
                    .map((client, index) => (
                      <Draggable
                        key={client.id}
                        draggableId={client.id}
                        index={index}
                      >
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            onClick={() => {
                              setDrawerMode("edit");
                              setCurrentClient(client);
                              setDrawerOpen(true);
                            }}
                          >
                            <ClientCard
                              client={client}
                              workers={workers}
                              isTerminated
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}

                  {/* 거래 종료 데이터 없음 표시 */}
                  {clients.filter((c) => c.status === "terminated").length ===
                    0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                      <TbMoodEmpty className="text-4xl mb-2" />
                      <p className="text-sm">종료된 거래처가 없습니다</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* 상세/수정/생성 Drawer */}
      <ClientDrawer
        open={drawerOpen}
        disabled={role !== "admin"}
        mode={drawerMode}
        client={currentClient}
        workers={workers}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentClient(null);
        }}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          if (drawerMode === "create") {
            await createClient(currentCompanyId, data);
            showAlert("거래처가 추가되었습니다.", { type: "success" });
          } else if (drawerMode === "edit" && currentClient) {
            await updateClient(currentClient.id, data);
            showAlert("거래처 정보가 수정되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        onDelete={
          drawerMode === "edit"
            ? async () => {
                await openDialog({
                  title: "거래처 삭제",
                  message: `"${currentClient?.name}" 거래처를 제거하시겠습니까?`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    if (currentClient) {
                      await deleteClient(currentClient.id);
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
    </>
  );
}
