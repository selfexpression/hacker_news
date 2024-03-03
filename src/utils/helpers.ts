import type { Comment, TreeData } from '@/types/definitions';
import { getCommentsById } from '@/app/lib/data';

export const generateTreeData = async (
  comments: Comment[],
): Promise<TreeData[]> => Promise.all(comments.map(async (comment) => ({
  title: comment.text,
  key: comment.id.toString(),
  children: comment.kids
    ? await generateTreeData(await getCommentsById(comment.kids))
    : [],
})));
