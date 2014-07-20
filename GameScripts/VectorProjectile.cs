using UnityEngine;
using System.Collections;

//Projectile script that causes projectile to randomly change vector as it travels
public class VectorProjectile : MonoBehaviour {
	private int playerID;
	private int teamID;
	private int vectorChance;
	private float lifeTime;
	private float damage;
	private float projSpeed;
	private Transform target;
	private float deltaR;
	private Vector3 initialDirection;
	private Vector3 currentDirection;

	public int PlayerID
	{
		get
		{
			return playerID;
		}
		set
		{
			playerID = value;
		}
	}

	public int TeamID
	{
		get
		{
			return teamID;
		}
		set
		{
			teamID = value;
		}
	}

	public int VectorChance
	{
		get
		{
			return vectorChance;
		}
		set
		{
			vectorChance = value;
		}
	}

	public float LifeTime
	{
		get
		{
			return lifeTime;
		}
		set
		{
			lifeTime = value;
		}
	}

	public float Damage
	{
		get
		{
			return damage;
		}
		set
		{
			damage = value;
		}
	}

	public float ProjSpeed
	{
		get
		{
			return projSpeed;
		}
		set
		{
			projSpeed = value;
		}
	}

	public Transform Target
	{
		get
		{
			return target;
		}
		set
		{
			target = value;
		}
	}

	private float DeltaR
	{
		get
		{
			return deltaR;
		}
		set
		{
			deltaR = value;
		}
	}

	public Vector3 InitialDirection
	{
		get
		{
			return initialDirection;
		}
		set
		{
			initialDirection = value;
		}
	}

	public Vector3 CurrentDirection
	{
		get
		{
			return currentDirection;
		}
		set
		{
			currentDirection = value;
		}
	}

	
	private float createTime = 0;

	void Start(){
		currentDirection = initialDirection;
		vectorChance = 50;
		deltaR = 45;
	}

	void FixedUpdate(){
		changeDirection();
	}
	
	void Update(){
		if(projDead()){
			PhotonNetwork.Destroy(gameObject);
		}
		moveProj(currentDirection * projSpeed);
		incrementCreateTime();
	}

	void OnTriggerEnter(Collider col){
		dealWithCollision(col);
	}
	
//	void OnCollisionEnter(Collision col){
//		Debug.Log("collision");
//		dealWithCollision(col);
//	}

	private void dealWithCollision(Collider col){
		if(col.gameObject.CompareTag("bullet")){
			if(!(col.gameObject.GetComponent<Bullet>().PlayerID == playerID)){
				PhotonNetwork.Destroy(gameObject);
			}
		}
		else if(col.gameObject.CompareTag("Player")){
			if(!(col.gameObject.GetComponent<PlayerInfo>().teamID == teamID)){
				col.gameObject.GetComponent<PlayerInfo>().health -= damage;
				PhotonNetwork.Destroy(gameObject);
			}
		}
		else{
			PhotonNetwork.Destroy(gameObject);
		}
	}

	private void changeDirection(){
		int updateVector = Random.Range(0,100);
		if(updateVector < vectorChance){
			currentDirection = initialDirection + new Vector3(Random.Range(-deltaR/180, deltaR/180),Random.Range(-deltaR/180, deltaR/180),Random.Range(-deltaR/180, deltaR/180));
		}
	}

	private bool projDead(){
		if(createTime >= lifeTime){
			return true;
		}
		return false;
	}

	private void moveProj(Vector3 direction){
		transform.Translate(direction);
	}

	private float incrementCreateTime(){
		createTime += Time.deltaTime;
		return createTime;
	}
}