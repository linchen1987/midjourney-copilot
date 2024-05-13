/**
 * This component is used to compile dynamic tailwind css class
 */
export default function CssCompile() {
  return (
    <div
      className="
        hidden for-compile bg-gray-600 bg-red-600 bg-blue-500 bg-red-500
        bg-green-500 bg-yellow-500 bg-purple-500
    "></div>
  );
}
