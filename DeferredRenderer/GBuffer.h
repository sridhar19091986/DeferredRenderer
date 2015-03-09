#ifndef GBUFFER_H
#define GBUFFER_H

#include "Shader.h"

class GBuffer {
public:
	GBuffer(int widthIn, int heightIn);
	~GBuffer();
	
	GLuint getFBO() const;
	GLuint getDepthTex() const;
	GLuint getPostEffects() const;
	int getWidth() const;
	int getHeight() const;

private:
	GLenum drawBuffers[3];

	GLuint fbo, depthTex, postEffects;
	GLuint position, normal, color;

	int width, height;
};

#endif