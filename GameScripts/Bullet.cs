using UnityEngine;
using System.Collections;

public class Bullet : MonoBehaviour {
	private int playerID;
	private int teamID;
	private float lifeTime;
	private float damage;
	private float projSpeed;
	private Vector3 direction;
	
	private float createTime = 0;

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

	public Vector3 Direction
	{
		get
		{
			return direction;
		}
		set
		{
			direction = value;
		}
	}

	void Update(){
		if(createTime >= lifeTime){
			PhotonNetwork.Destroy(gameObject);
		}
		transform.Translate(direction * projSpeed);
		createTime += Time.deltaTime;
	}

	void OnCollisionEnter(Collision col){
		if(col.gameObject.CompareTag("bullet")){
			if(!(col.gameObject.GetComponent<Bullet>().playerID == playerID)){
				PhotonNetwork.Destroy(gameObject);
			}
		}
		else if(col.gameObject.CompareTag("Player")){
			Debug.Log ("here");
			Debug.Log (damage);
			if(!(col.gameObject.GetComponent<PlayerInfo>().teamID == teamID)){
				col.gameObject.GetComponent<PlayerInfo>().health -= damage;
				PhotonNetwork.Destroy(gameObject);
			}
		}
		else{
			PhotonNetwork.Destroy(gameObject);
		}
	}
}
