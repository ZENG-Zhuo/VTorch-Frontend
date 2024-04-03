import cv2
import numpy as np

# img = cv2.imread('VTorch.jpg')

# jpg_img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
# cv2.imwrite('img.jpg',jpg_img)

# for i in range(jpg_img.shape[0]):
#     for j in range(jpg_img.shape[1]):
#         if jpg_img[i][j][0] == 255:
#             jpg_img[i][j] = [255,255,255,0]
#         else:
#             print(jpg_img[i][j])


# cv2.imwrite('VTorch_a.jpg',jpg_img)
# # print(jpg_img)
# print(jpg_img.shape)

im = cv2.imread('Vtorch.jpg')
height, width, channels = im.shape
new_im = np.ones((height, width, 4)) * 255
new_im[:, :, :3] = im
for i in range(height):
    for j in range(width):
        if new_im[i, j, :3].tolist() == [255.0, 255.0, 255.0]:
            new_im[i, j, :] = np.array([255.0, 255.0, 255.0, 0])
cv2.imwrite('tmp_transparent.png', new_im)
