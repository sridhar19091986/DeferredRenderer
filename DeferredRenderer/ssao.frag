#version 420 core

in vec2 coord;

uniform mat4 mView;
uniform mat3 mNormal;
uniform mat4 projection;

uniform float fov;
uniform vec2 noiseScale;
uniform vec3 kernel[16];

uniform sampler2D positionMap;
uniform sampler2D normalMap;
uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform sampler2D noiseMap;

out vec4 fragColor;

const float radius = 1;

float linearizeDepth(float depth) {
    float near = 0.1; 
    float far = 1000.0; 
    float z = depth * 2.0 - 1.0; //Back to NDC 
    return (2.0 * near) / (far + near - z * (far - near));	
}

void main() {
    vec3 norm = normalize(texture(normalMap, coord).xyz * 2.0 - 1.0);
	vec3 pos = texture(positionMap, coord).xyz;
	float depth = linearizeDepth(texture(depthMap, coord).x);

	vec2 ndc = coord * 2.0 - 1.0;
	vec3 viewRay = vec3(ndc.x * fov * 1, ndc.y * fov, 1.0);
	vec3 origin = viewRay * depth;

	vec3 rVec = texture(noiseMap, coord * noiseScale).xyz * 2.0 - 1.0;
	vec3 tangent = normalize(rVec - norm * dot(rVec, norm));
	vec3 bitangent = cross(norm, tangent);
	mat3 tbn = mat3(tangent, bitangent, norm);

	float occlusion = 0.0f;
	for (int i = 0; i < 16; i++) {
		//Get sample position
		vec3 s = tbn * kernel[i];
		s = s * radius + origin;

		//Project sample position
		vec4 offset = vec4(s, 1.0);
		offset = projection * offset;
		offset.xy /= offset.w;
		offset.xy = offset.xy * 0.5 + 0.5;

		//Get sample depth
		float sampleDepth = linearizeDepth(texture(depthMap, offset.xy).x);

		//Range check and accumulate
		float rangeCheck = abs(origin.z - sampleDepth) < radius ? 1.0 : 0.0;
		occlusion += (sampleDepth <= s.z ? 1.0 : 0.0) * rangeCheck;
	}

	occlusion = 1.0 - (occlusion / 16.0);

	//fragColor = vec4(origin, 1);
	fragColor = vec4(occlusion);
	//fragColor = vec4(linearizeDepth(texture(depthMap, coord).x));
}