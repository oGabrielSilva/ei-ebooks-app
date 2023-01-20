export default class ImageModule {
  public static imgToDataURL(
    file: File | Blob | string | null,
    width?: number,
    height?: number
  ) {
    const getWH = (h?: boolean) => (h && height ? height : width ? width : 100);
    const p = new Promise<string>((resolve) => {
      try {
        if (!file) return resolve('');
        const url = URL.createObjectURL(file as Blob);
        const img = new Image();
        img.onload = async () => {
          const w = img.width;
          const h = img.height;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          const modifiedImage =
            w < h
              ? await ImageModule.modifiedImageHeight(img, w, h)
              : w > h
              ? await ImageModule.modifiedImageWidth(img, w, h)
              : img;
          ctx.canvas.width = getWH();
          ctx.canvas.height = getWH(true);
          ctx.drawImage(modifiedImage, 0, 0, getWH(), getWH(true));
          const dataUrl = ctx.canvas.toDataURL();
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        };
        img.crossOrigin = 'Anonymous';
        img.src = url;
      } catch (error) {
        resolve('');
      }
    });
    return p;
  }

  private static modifiedImageHeight(
    img: HTMLImageElement,
    width: number,
    height: number
  ) {
    return new Promise<HTMLImageElement>((resolve) => {
      const cv = document.createElement('canvas');
      const context = cv.getContext('2d') as CanvasRenderingContext2D;
      context.canvas.width = width;
      context.canvas.height = width;
      context.drawImage(img, 0, height * 0.2, width, width, 0, 0, width, width);
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = context.canvas.toDataURL();
    });
  }

  private static modifiedImageWidth(
    img: HTMLImageElement,
    width: number,
    height: number
  ) {
    return new Promise<HTMLImageElement>((resolve) => {
      const cv = document.createElement('canvas');
      const context = cv.getContext('2d') as CanvasRenderingContext2D;
      context.canvas.width = height;
      context.canvas.height = height;
      context.drawImage(
        img,
        width * 0.2,
        0,
        height,
        height,
        0,
        0,
        height,
        height
      );
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = context.canvas.toDataURL();
    });
  }
}
