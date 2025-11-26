import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import dayjs from "dayjs";
import { TbMoodEmpty } from "react-icons/tb";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import { supabase } from "@/lib/supabase";
import { useChecklistStore } from "@/stores/checklistStore";
import { useAlert } from "@/components/AlertProvider";

interface ChecklistCommentsProps {
  checklistId: string;
}

export default function ChecklistComments({
  checklistId,
}: ChecklistCommentsProps) {
  const { comments, fetchComments, addComment } = useChecklistStore();

  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const list = comments[checklistId] ?? [];

  // 🔐 현재 로그인 유저 가져오기
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 📌 특정 checklist 댓글 로딩
  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchComments(checklistId);
      setLoading(false);
    })();
  }, [checklistId]);

  // 📌 댓글 등록
  const handleAddComment = async () => {
    if (!newComment.trim() || !userId) return;

    await addComment(checklistId, newComment.trim(), userId);
    setNewComment("");
    showAlert("댓글이 등록되었습니다.", { type: "success" });
    await fetchComments(checklistId);
  };

  // 📌 댓글 삭제
  //   const handleDeleteComment = async (commentId: string) => {
  //     await deleteComment(commentId, checklistId);
  //     showAlert("삭제되었습니다.", { type: "success" });
  //   };

  return (
    <FlexWrapper direction="col" gap={0} classes="pt-4 bg-gray-50 px-4 pb-6">
      <FlexWrapper gap={2} items="center">
        <Typography variant="H4">댓글</Typography>
        <Badge color="green" size="md">
          {list.length}
        </Badge>
      </FlexWrapper>

      {/* 로딩 스피너 */}
      {loading ? (
        <FlexWrapper
          classes="h-[calc(100dvh-50px-287px-50px-30px-16px-60px)]"
          justify="center"
          items="center"
        >
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
          />
        </FlexWrapper>
      ) : (
        <div>
          {/* 댓글 없음 */}
          {list.length === 0 && (
            <div className="h-[calc(100dvh-50px-287px-50px-30px-16px-60px)] flex flex-col items-center justify-center gap-2 p-6">
              <TbMoodEmpty className="text-4xl text-gray-300" />
              <p className="text-gray-400 text-sm">댓글이 없습니다</p>
            </div>
          )}

          {/* 댓글 리스트 */}
          <div className="h-[calc(100dvh-50px-287px-50px-30px-16px-60px)] overflow-y-auto scroll-thin py-2">
            {list.map((c) => {
              const mine = c.created_by === userId;
              return (
                <FlexWrapper
                  key={c.id}
                  gap={1}
                  items="start"
                  direction={mine ? "row-reverse" : "row"}
                  classes="mb-3"
                >
                  {/* 작성자 */}
                  <FlexWrapper gap={1} items="center" direction="col">
                    <Avatar
                      size="sm"
                      type="text"
                      name={c.profiles?.nickname || "-"}
                    />
                    <Typography
                      variant="C1"
                      classes="!font-normal text-gray-600 w-[60px] truncate text-center"
                    >
                      {c.profiles?.nickname || "익명"}
                    </Typography>
                  </FlexWrapper>

                  {/* 내용 박스 */}
                  <FlexWrapper
                    direction="col"
                    gap={1}
                    items={mine ? "end" : "start"}
                    classes="max-w-[calc(100%-100px)] bg-white rounded-lg border p-2"
                  >
                    <Typography
                      variant="B2"
                      classes="text-gray-700 whitespace-pre-wrap"
                    >
                      {c.content}
                    </Typography>
                    <Typography variant="C1" classes="!text-gray-400">
                      {dayjs(c.created_at).format("YYYY.MM.DD HH:mm")}
                    </Typography>

                    {/* {mine && (
                      <Button
                        variant="clear"
                        size="sm"
                        classes="!text-danger !text-xs"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        삭제
                      </Button>
                    )} */}
                  </FlexWrapper>
                </FlexWrapper>
              );
            })}
          </div>

          {/* 댓글 입력창 */}
          <FlexWrapper gap={2} items="center" classes="mt-2">
            <TextInput
              classes="flex-1 !h-[42px] !text-sm"
              inputProps={{
                value: newComment,
              }}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <Button
              variant="contain"
              color="green"
              classes="!px-3 !py-2 !text-sm shrink-0 !h-[42px]"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              등록
            </Button>
          </FlexWrapper>
        </div>
      )}
    </FlexWrapper>
  );
}
