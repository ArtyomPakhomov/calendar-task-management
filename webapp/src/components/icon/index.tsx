import { type IconBaseProps } from 'react-icons'
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from 'react-icons/bi'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'

const icons = {
  heartFilled: FcLike,
  heartEmpty: FcLikePlaceholder,
  likeFilled: BiLike,
  likeEmpty: BiSolidLike,
  dislikeFilled: BiDislike,
  dislikeEmpty: BiSolidDislike,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  const CreateElement = icons[name]
  return <CreateElement {...restProps} />
}
