uniform sampler2D envMap;
uniform float zoom;
uniform float rotationX;
uniform float rotationY;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

// Rotation matrix around Y axis
mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
    );
}

// Rotation matrix around X axis
mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

vec2 cubeToUV(vec3 reflectDir) {
    // Find the dominant axis (largest absolute component)
    vec3 absDir = abs(reflectDir);
    float maxAxis = max(max(absDir.x, absDir.y), absDir.z);

    vec2 uv;

    // Determine which cube face we're hitting and calculate UV coordinates
    if (absDir.x == maxAxis) {
        // +X or -X face
        if (reflectDir.x > 0.0) {
            // +X face
            uv = vec2(-reflectDir.z, reflectDir.y) / reflectDir.x;
        } else {
            // -X face
            uv = vec2(reflectDir.z, reflectDir.y) / -reflectDir.x;
        }
    } else if (absDir.y == maxAxis) {
        // +Y or -Y face
        if (reflectDir.y > 0.0) {
            // +Y face
            uv = vec2(reflectDir.x, -reflectDir.z) / reflectDir.y;
        } else {
            // -Y face
            uv = vec2(reflectDir.x, reflectDir.z) / -reflectDir.y;
        }
    } else {
        // +Z or -Z face
        if (reflectDir.z > 0.0) {
            // +Z face
            uv = vec2(reflectDir.x, reflectDir.y) / reflectDir.z;
        } else {
            // -Z face
            uv = vec2(-reflectDir.x, reflectDir.y) / -reflectDir.z;
        }
    }

    // Apply zoom by scaling UV coordinates around center
    uv = uv / zoom;

    // Convert from [-1, 1] range to [0, 1] UV range
    uv = uv * 0.5 + 0.5;

    return uv;
}

void main() {
    // Calculate reflection vector
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(vViewDirection);
    vec3 reflectDir = reflect(-viewDir, normal);

    // Apply rotations to the reflection vector (rotate the environment)
    reflectDir = rotateX(rotationX) * reflectDir;
    reflectDir = rotateY(rotationY) * reflectDir;

    // Convert reflection vector to UV coordinates
    vec2 uv = cubeToUV(reflectDir);

    // Sample the texture
    vec4 envColor = texture2D(envMap, uv);

    gl_FragColor = envColor;
}
