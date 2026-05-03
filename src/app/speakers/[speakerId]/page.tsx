import { getProductById } from "@/features/products/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ speakerId: string }>;
}) {
  const { speakerId } = await params;
  const product = await getProductById(speakerId);
  console.log("Speaker Detail:", product);

  return <div>Speaker Details: {product?.id}</div>;
}
