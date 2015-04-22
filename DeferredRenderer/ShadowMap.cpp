#include "ShadowMap.h"

ShadowMap::ShadowMap(int width, int height) : width(width), height(height) {
	//Create FBO
	glGenFramebuffers(1, &fbo);
	glBindFramebuffer(GL_DRAW_FRAMEBUFFER, fbo);

	//Create depth texture
	glGenTextures(1, &depth);
	glBindTexture(GL_TEXTURE_2D, depth);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT16, width, height, 0, GL_DEPTH_COMPONENT, GL_FLOAT, nullptr);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, depth, 0);
	
	glDrawBuffer(GL_NONE);

	//Unbind
	glBindFramebuffer(GL_FRAMEBUFFER, 0);
}

ShadowMap::~ShadowMap() {
	if (fbo != 0) {
		glDeleteFramebuffers(1, &fbo);
		glDeleteTextures(1, &depth);
	}
}