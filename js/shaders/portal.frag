uniform sampler2D envMap;
uniform float zoom;
uniform float rotationX;
uniform float rotationY;
uniform int projectionMode; // 0: cubemap, 1: tinyPlanet, 2: equirectangular
uniform bool directView;
uniform float aspectRatio;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

#define PI 3.14159265359

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

vec2 tinyPlanetToUV(vec3 direction) {
    // --- 1. Get Polar Coordinates ---
    // Longitude: angle around the Y axis
    float angle = atan(direction.z, direction.x);

    // Latitude: angle from top (zenith=0, nadir=PI)
    float theta = acos(direction.y);

    // --- 2. Map Latitude to Radius ---
    // Center (0.0) is nadir (looking down), edge (0.5) is zenith (looking up)
    float radius = (1.0 - (theta / PI)) * 0.5;

    // Apply zoom to radius
    radius = radius * zoom;

    // --- 3. Convert to Cartesian & Apply Aspect Fix ---
    float u = radius * cos(angle);
    float v = radius * sin(angle);

    // Critical aspect ratio correction to prevent stretching
    u = u / aspectRatio;

    // --- 4. Final UV Lookup ---
    // Center the coordinates from (-0.5, 0.5) to (0.0, 1.0)
    vec2 uv = vec2(0.5 + u, 0.5 + v);

    return uv;
}

vec2 equirectangularToUV(vec3 direction) {
    // Standard equirectangular (lat/long) projection
    // Longitude: -PI to PI mapped to 0 to 1
    float u = atan(direction.z, direction.x) / (2.0 * PI) + 0.5;

    // Latitude: -PI/2 to PI/2 mapped to 0 to 1
    float v = asin(direction.y) / PI + 0.5;

    // Apply zoom by scaling around center
    vec2 uv = vec2(u, v);
    uv = (uv - 0.5) / zoom + 0.5;

    return uv;
}

void main() {
    vec2 uv;

    if (directView) {
        // Direct view mode: use view direction instead of reflection
        vec3 viewDir = normalize(vViewDirection);
        vec3 direction = viewDir;

        // Apply rotations
        direction = rotateX(rotationX) * direction;
        direction = rotateY(rotationY) * direction;

        // Convert to UV based on projection mode
        if (projectionMode == 1) {
            uv = tinyPlanetToUV(direction);
        } else if (projectionMode == 2) {
            uv = equirectangularToUV(direction);
        } else {
            uv = cubeToUV(direction);
        }
    } else {
        // Reflection mode: use reflection vector (original behavior)
        vec3 normal = normalize(vWorldNormal);
        vec3 viewDir = normalize(vViewDirection);
        vec3 reflectDir = reflect(-viewDir, normal);

        // Apply rotations to the reflection vector (rotate the environment)
        reflectDir = rotateX(rotationX) * reflectDir;
        reflectDir = rotateY(rotationY) * reflectDir;

        // Convert reflection vector to UV coordinates based on projection mode
        if (projectionMode == 1) {
            uv = tinyPlanetToUV(reflectDir);
        } else if (projectionMode == 2) {
            uv = equirectangularToUV(reflectDir);
        } else {
            uv = cubeToUV(reflectDir);
        }
    }

    // Sample the texture
    vec4 envColor = texture2D(envMap, uv);

    gl_FragColor = envColor;
}
